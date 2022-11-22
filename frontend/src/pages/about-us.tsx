import Layout from '@/components/common/Layout/DefaultLayout';
import Section from '@/components/Section';
import { teamMembers } from '@/utils/data';
import type { NextPage } from 'next';
import Img from 'next/image';
import Link from 'next/link';
import { Autoplay, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const AboutUs: NextPage = () => {
  return (
    <Layout title="About Us | Crypto Digging Marketplace">
      <div id="about-us-page">
        <div className="page-container">
          <Section title="Team Members" className="team">
            <div className="members__slider">
              <Swiper
                loop
                modules={[Scrollbar, Autoplay]}
                autoplay={{ delay: 3000 }}
                spaceBetween={50}
                slidesPerView={1}
                scrollbar={{ draggable: true }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  992: {
                    slidesPerView: 3,
                  },
                }}
              >
                {teamMembers.map((member: any, index: number) => {
                  return (
                    <SwiperSlide key={`member-${index + 1}`}>
                      <div className="member" key={`nfts-item-${index + 1}`}>
                        <Img src={member.avatar} alt="avatar" width={140} height={140} />
                        <p className="member__name">{member.name}</p>
                        <p>{member.role}</p>
                        <p className="member__quote">{member.quote}</p>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </Section>

          <Section title="Contact Us" className="contact">
            <div className="contact__list">
              <div className="contact__item">
                <Img src={'/images/email.svg'} alt="email" width={48} height={44} layout="fixed" />
                <span className="contact__item-text">r2w@gmail.com</span>
              </div>
              <div className="contact__item">
                <Img src={'/images/phone.svg'} alt="email" width={48} height={44} layout="fixed" />
                <span className="contact__item-text">+84 0833877441</span>
              </div>
              <div className="contact__item">
                <Img
                  src={'/images/facebook.svg'}
                  alt="email"
                  width={48}
                  height={44}
                  layout="fixed"
                />
                <Link href={`https://www.facebook.com/ReferenceToWorld`}>
                  <a className="contact__item-text" target="_blank" rel="noopener">
                    www.facebook.com/r2ws
                  </a>
                </Link>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
