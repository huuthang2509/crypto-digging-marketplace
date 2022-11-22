import Layout from '@/components/common/Layout/DefaultLayout';
import { PATH } from '@/utils/constants';
import type { NextPage } from 'next';
import Img from 'next/image';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <div id="home-page">
          <div className="banner">
            <Img src={'/images/home-banner.png'} alt="banner" layout="fill" objectFit="cover" />
          </div>

          <div className="meet-r2w page-container">
            <div className="meet-r2w__left">
              <h1 className="meet-r2w__title">Meet R2Ws</h1>
              <p className="meet-r2w__subtitle">“Bringing virtual world to life”</p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro sunt eveniet vitae
                vero quidem corrupti nobis? Dignissimos reiciendis officia voluptatibus eos eveniet
                officiis, magni, veniam, laudantium necessitatibus et ullam quidem?
              </p>
            </div>
            <div className="meet-r2w__right">
              <Img src={'/images/r2w.svg'} alt="r2w-team" layout="fill" objectFit="contain" />
            </div>
          </div>

          <div className="game">
            <div className="game__left">
              <Img
                src={'/images/crypto-digging-1.jpg'}
                alt="game"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="game__right">
              <div className="game__right-title">
                <h3>
                  <Link href={PATH.game}>
                    <a>CRYPTO DIGGING</a>
                  </Link>
                </h3>
                <div className="game__right-arrow">
                  <Link href={PATH.game}>
                    <a>
                      <Img src={'/images/right-arrow.svg'} alt="arrow" width={20} height={20} />
                    </a>
                  </Link>
                </div>
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industrys standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.{' '}
              </p>
              {/* <div className="game__get-google-play">
                <Img
                  src={'/images/google-play.png'}
                  alt="get-on-google-play"
                  layout="fill"
                  objectFit="contain"
                />
              </div> */}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
