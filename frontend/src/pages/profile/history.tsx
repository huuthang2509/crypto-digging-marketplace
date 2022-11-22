import userApi from '@/api/user';
import MarketLayout from '@/components/common/Layout/MarketLayout';
import ErrorPopup from '@/components/Popup/ErrorPopup';
import ProfileHistoryFilterBar from '@/components/ProfileHistory/FilterBar';
import ProfileHistorySearchResult from '@/components/ProfileHistory/Result';
import { MarketRefType } from '@/models/index';
import { showModal } from '@/redux/slices/modal';
import { useAppDispatch } from '@/redux/store';
import { PATH } from '@/utils/constants';
import _ from 'lodash';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ProfileHistory: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { action, logType = MarketRefType.Hero } = router.query;

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryObject = { ...Object.fromEntries(urlSearchParams.entries()) };
    search(queryObject);
  }, []);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [histories, setHistories] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const search = async (queryObject: any) => {
    try {
      setLoading(true);
      const res: any = await userApi.getUserHistory(queryObject);
      setHistories(res.data);
      setCurrentPage(res.pagination.page);
      setTotalPage(res.pagination.totalPages);
    } catch (error: any) {
      const errorMsg = JSON.parse(error.message).message || JSON.parse(error.message).errorMsg;
      dispatch(showModal(<ErrorPopup title='Error' description={errorMsg} />))
    } finally {
      setLoading(false);
    }
  };

  const onChangeQueries = (obj: any) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryObject = _.pickBy({ ...Object.fromEntries(urlSearchParams.entries()), ...obj }, _.identity);
    router.push({ pathname: PATH.profileHistory, query: _(queryObject).toPairs().orderBy([0], 'asc').fromPairs().value() });
    search(queryObject);
  };

  return (
    <MarketLayout title="Profile History | Crypto Digging Marketplace">
      <div id="user-history-page">
        <div className="page-wrapper">
          <div className='page-wrapper__left'>
            <ProfileHistoryFilterBar
              defaultAction={`${action}`}
              defaultType={`${logType}`}
              onChangeQueries={onChangeQueries}
              resetSearch={() => { router.push(PATH.profileHistory); search({}) }}
            />
          </div>
          <div className='page-wrapper__right'>
            <ProfileHistorySearchResult 
              isLoading={isLoading} 
              data={histories} 
              type={`${logType}` || MarketRefType.Hero}
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

export default ProfileHistory;
