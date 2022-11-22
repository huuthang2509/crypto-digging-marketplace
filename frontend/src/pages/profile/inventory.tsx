import MarketLayout from '@/components/common/Layout/MarketLayout';
import { BoxTab } from '@/components/Inventory/BoxTab';
import InventoryFilterSearchBar from '@/components/Inventory/FilterSearchBar';
import { HeroesTab } from '@/components/Inventory/HeroTab';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import { MarketRefType } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { getMyBoxInventory, getMyHeroInventory, setBoxSearch, setHeroSearch, setInventorySearchType } from '@/redux/slices/user';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

interface ICategory {
  id: number
  name: string
  type: MarketRefType
  isActive: boolean
}

const InventoryPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const selectedInventoryTab = useAppSelector((state) => state.user.selectedInventoryTab);
  const boxInventory = useAppSelector((state) => state.user.boxInventory);
  const heroInventory = useAppSelector((state) => state.user.heroInventory);
  const boxSearch = useAppSelector((state) => state.user.boxInventory.search);
  const heroSearch = useAppSelector((state) => state.user.heroInventory.search);

  useEffect(() => {
    async function getInventory() {
      try {
        setLoading(true);
        if (selectedInventoryTab === MarketRefType.Box)
          dispatch(getMyBoxInventory());
        else if (selectedInventoryTab === MarketRefType.Hero)
          dispatch(getMyHeroInventory());
      } catch (error) {
        console.log(error);
        dispatch(showModal(<ErrorPopup title='Error' description='' />));
      } finally {
        setLoading(false);
      }
    };
    getInventory();
  }, [selectedInventoryTab, boxSearch, heroSearch]);

  const setSearchType = (type: MarketRefType) => {
    dispatch(setInventorySearchType(type));
  };
  const setSearchKeywordAndQuality = (search: any) => {
    if (selectedInventoryTab === MarketRefType.Hero) {
      dispatch(setHeroSearch(search));
      return;
    }
    if (selectedInventoryTab === MarketRefType.Box) {
      dispatch(setBoxSearch(search));
      return;
    }
  };

  return (
    <MarketLayout title="Inventory | Crypto Digging Marketplace">
      <div id="inventory-page">
        <div className="page-wrapper">
          <div>
            <InventoryFilterSearchBar 
              defaultType={selectedInventoryTab} 
              defaultRarities={
                selectedInventoryTab === MarketRefType.Box 
                ? boxSearch.quality
                : heroSearch.quality
              }
              defaultSearch={{
                [MarketRefType.Box]: boxSearch.search,
                [MarketRefType.Hero]: heroSearch.search
              }}
              onChangeType={type => setSearchType(type)}
              onChangeSearch={search => setSearchKeywordAndQuality(search)}
              resetSearch={() => {}}
            />
          </div>
          <div className='content'>
            {
              selectedInventoryTab === MarketRefType.Hero ? (
                <HeroesTab 
                  loading={loading} 
                  heroInventory={heroInventory.result} 
                  total={heroInventory.total}
                  currentPage={heroInventory.currentPage} 
                  totalPages={heroInventory.totalPages}
                  onSearch={(queries) => dispatch(getMyHeroInventory(queries.page))} 
                />
              ) : (
                <BoxTab 
                  loading={loading}
                  boxInventory={boxInventory.result}
                  total={boxInventory.total}
                  currentPage={boxInventory.currentPage} 
                  totalPages={boxInventory.totalPages}
                  onSearch={(queries) => dispatch(getMyBoxInventory(queries.page))}  
                />
              )
            }
          </div>
        </div>
      </div>
    </MarketLayout>
  );
};

export default InventoryPage;

