import marketplaceAPI from '@/api/marketplace';
import MarketLayout from '@/components/common/Layout/MarketLayout';
import { MarketplaceSearchBar } from '@/components/Marketplace/SearchBar';
import { MarketplaceSearchResult } from '@/components/Marketplace/SearchResult';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import { MarketRefType } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { useAppDispatch } from '@/redux/store';
import { PATH } from '@/utils/constants';
import _ from 'lodash';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const MarketPlace: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const search = async (queryObject: any) => {
    try {
      setLoading(true);
      const res: any = await marketplaceAPI.getMarketItems(queryObject);
      setHeroes(res.data);
      setCurrentPage(res.pagination.page);
      setTotalPage(res.pagination.totalPages);
    } catch (error: any) {
      const errorMsg = JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
      dispatch(showModal(<ErrorPopup title='Error opening box' description={errorMsg} />))
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryObject = { ...Object.fromEntries(urlSearchParams.entries()) };
    search(queryObject);
  }, []);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [heroes, setHeroes] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const { priceFrom, priceTo, quality, sort, type = MarketRefType.Hero } = router.query;
  const defaultRarities = (quality as string)?.split(",") || [];

  const onChangeQueries = (obj: any) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryObject = _.pickBy({ ...Object.fromEntries(urlSearchParams.entries()), ...obj }, _.identity);
    router.push({ pathname: PATH.marketplace, query: _(queryObject).toPairs().orderBy([0], 'asc').fromPairs().value() });
    search(queryObject);
  };

  return (
    <MarketLayout title="Marketplace | Crypto Digging Marketplace">
      <div id="marketplace-page">
        <div className="page-wrapper">
          <div className='page-wrapper__left'>
            <MarketplaceSearchBar
              defaultRarities={defaultRarities}
              defaultPriceRange={[priceFrom ? Number(priceFrom) : undefined, priceTo ? Number(priceTo) : undefined]}
              defaultSort={`${sort}`}
              defaultType={`${type}`}
              onChangeQueries={onChangeQueries}
              resetSearch={() => { router.push(PATH.marketplace); search({}) }}
            />
          </div>
          <div className='page-wrapper__right'>
            <MarketplaceSearchResult
              isLoading={isLoading}
              data={heroes} 
              currentPage={currentPage} 
              totalPage={totalPage} 
              onChangeQueries={onChangeQueries}
            />
          </div>
        </div>
      </div>
    </MarketLayout>
  );
};

export default MarketPlace;
