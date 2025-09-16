<?php

namespace S25Quotes\Cart;


use Shopware\Core\Checkout\Cart\Cart;
use Shopware\Core\Checkout\Cart\CartBehavior;
use Shopware\Core\Checkout\Cart\LineItem\CartDataCollection;
use Shopware\Core\Checkout\Cart\LineItem\Group\LineItemGroupBuilder;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Promotion\Cart\PromotionCalculator;
use Shopware\Core\Checkout\Promotion\Cart\PromotionProcessor;
use Shopware\Core\Content\Product\ProductCollection;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
class PromotionProcessorDecorated extends PromotionProcessor
{
  /**
   * @var EntityRepository<ProductCollection>
   */
    private EntityRepository $customPriceRepository;

  /**
   * @param EntityRepository<ProductCollection> $customPriceRepository
   */

    public function __construct(
        PromotionCalculator  $promotionCalculator,
        LineItemGroupBuilder $groupBuilder,
        EntityRepository     $customPriceRepository
    )
    {
        $this->customPriceRepository = $customPriceRepository;

        parent::__construct($promotionCalculator, $groupBuilder);
    }

    public function process(
        CartDataCollection  $data,
        Cart                $original,
        Cart                $toCalculate,
        SalesChannelContext $context,
        CartBehavior        $behavior
    ): void
    {

        foreach ($toCalculate->getLineItems() as $lineItem) {
            if ($this->hasCustomPrice($lineItem, $context)) {
                $lineItem->setPayloadValue('isCustomPrice', true);
            }
        }

        parent::process($data, $original, $toCalculate, $context, $behavior);

    }

    private function hasCustomPrice(LineItem $lineItem, SalesChannelContext $context): bool
    {

        if ($lineItem->getType() != 'product') {
            return false;
        }
        $customerId = $context->getCustomerId();
        $productId = $lineItem->getReferencedId();
        if (!$productId || !$customerId) {
            return false;
        }

        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('productId', $productId));
        $criteria->addFilter(new EqualsFilter('customerId', $customerId));
        $customPrice = $this->customPriceRepository->search($criteria, $context->getContext())->first();
        return $customPrice !== null;
    }


}