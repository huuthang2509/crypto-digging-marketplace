import Layout from '@/components/common/Layout/DefaultLayout';
import clsx from 'clsx';
import type { NextPage } from 'next';
import Img from 'next/image';

const GamePage: NextPage = () => {
  const gameplayData = [
    {
      img: '/images/crypto-digging-2.jpg',
      title: 'title 1',
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
    },
    {
      img: '/images/crypto-digging-3.jpg',
      title: 'title 2',
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
    },
  ];

  return (
    <Layout title="Crypto Digging | Crypto Digging Marketplace">
      <div id="game-page">
        <div className="top">
          <h1 className="top__title">CRYPTO DIGGING</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
        </div>

        <div className="game-play">
          <div className="game-play__top-image">
            <Img
              src={'/images/crypto-digging-1.jpg'}
              alt="game"
              layout="fill"
              objectFit="contain"
            />
          </div>

          <h3 className="game-play__title">GAMEPLAY</h3>

          {gameplayData.map((item: any, index: number) => {
            return (
              <div
                key={`game-play-${index + 1}`}
                className={clsx('game-play__item', { 'game-play__item--reverse': index % 2 })}
              >
                <div className="game-play__item-img">
                  <Img src={item.img} alt="game" layout="fill" objectFit="contain" />
                </div>
                <div className="game-play__item-text">
                  <p>{item.title}</p>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default GamePage;
