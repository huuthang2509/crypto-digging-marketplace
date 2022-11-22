import MarketLayout from '@/components/common/Layout/MarketLayout';
import SolToCDGTab from '@/components/Exchange/SolToCDG';
import WithdrawToSOL from '@/components/Exchange/WithdrawToSol';
import clsx from 'clsx';
import type { NextPage } from 'next';
import { useState } from 'react';

enum ExchangeType {
	SOL_CDG = "SOL_CDG",
	CDG_SOL = "CDG_SOL"
}
interface ITab {
  id: number
  name: string
  type: ExchangeType
  isActive: boolean
}

const ExchangePage: NextPage = () => {
  const [categories, setCategories] = useState<Array<ITab>>([
    { id: 1, name: "Withdraw to SOL", type: ExchangeType.CDG_SOL, isActive: true },
    { id: 2, name: "Exchange to CDG", type: ExchangeType.SOL_CDG, isActive: false }
  ]);
  const activeTab = categories.find(cate => cate.isActive)?.type;

  const handleClickCategory = (cateId: number) => {
    const tempCategories = [...categories];
    const category = tempCategories.find(cate => cate.id === cateId);
    if (!category) return;
    for (const category of tempCategories) {
      category.isActive = false;
    }
    category.isActive = true;
    setCategories(tempCategories);
  };

  return (
    <MarketLayout title="Exchange | Crypto Digging Marketplace">
      <div id="exchange-page">
        <div className="page-container">
			<div className="categories">
            {
              categories.map((category: ITab, index: number) => (
                <div 
                  key={`category-${index + 1}`} 
                  className={clsx("category", { "category--active": category.isActive })}
                  onClick={() => handleClickCategory(category.id)}
                >
                  {category.name}
                </div>
              ))
            }
          </div>
          <div className='content'>
            {
              activeTab === ExchangeType.SOL_CDG ? (
				        <SolToCDGTab />
              ) : (
				        <WithdrawToSOL />
              )
            }
          </div>
        </div>
      </div>
    </MarketLayout>
  );
};

export default ExchangePage;

