import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles.css";

const offers = [
  {
    title: "Mega Fashion Sale",
    subtitle: "Up to 60% OFF on all apparels 👕",
    img: "https://images.unsplash.com/photo-1600180758890-6ee7e1b0c9c7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "New Gadget Arrivals",
    subtitle: "Trendy earbuds, watches & more 🎧⌚",
    img: "https://images.unsplash.com/photo-1606813907293-94d4b2fa5c7f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Weekend Special Offer",
    subtitle: "Flat 40% OFF on jackets & hoodies 🧥",
    img: "https://images.unsplash.com/photo-1598032784212-9f6ab9a9b9ad?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Accessories Sale",
    subtitle: "Stylish bags, caps & sunglasses 🕶️",
    img: "https://images.unsplash.com/photo-1571689936114-3e89e6d6f9e1?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function OffersCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div className="carousel-container" data-aos="fade-up">
      <Slider {...settings}>
        {offers.map((offer, index) => (
          <div className="offer-slide" key={index}>
            <img src={offer.img} alt={offer.title} />
            <div className="offer-overlay">
              <h2>{offer.title}</h2>
              <p>{offer.subtitle}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
