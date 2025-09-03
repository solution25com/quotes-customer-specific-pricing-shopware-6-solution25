<?php declare(strict_types=1);

namespace S25Quotes\Core\Rule;

use Shopware\Core\Checkout\Cart\Rule\LineItemScope;
use Shopware\Core\Framework\Rule\Rule;
use Shopware\Core\Framework\Rule\RuleConfig;
use Shopware\Core\Framework\Rule\RuleConstraints;
use Shopware\Core\Framework\Rule\RuleScope;
use Shopware\Core\Framework\Log\Package;

#[Package('checkout')]
class LineItemHasCustomPriceRule extends Rule
{
  final public const RULE_NAME = 'lineItemHasCustomPrice';


  public function __construct(protected bool $hasCustomPrice = false)
  {
    parent::__construct();
  }

  public function getConfig(): RuleConfig
  {
    return (new RuleConfig())->booleanField('hasCustomPrice');
  }

  public function match(RuleScope $scope): bool
  {

    if (!$scope instanceof LineItemScope) {
      return false;
    }

    $lineItem = $scope->getLineItem();
    $isCustomPrice = $lineItem->getPayloadValue('isCustomPrice');
    return !$isCustomPrice;
  }


  public function getConstraints(): array
  {
    return [
      'hasCustomPrice' => RuleConstraints::bool(),
    ];
  }
}