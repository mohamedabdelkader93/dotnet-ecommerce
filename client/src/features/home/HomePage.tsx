import { Box, Typography } from "@mui/material";
import Slider from 'react-slick';

import algoliasearch from 'algoliasearch/lite';
import { Hit as AlgoliaHit } from 'instantsearch.js';
import { InstantSearch, Pagination, SearchBox, Hits, InfiniteHits, Highlight } from 'react-instantsearch';
import { Tab, Tabs } from "./components/Tabs";
import "./home.css"
const searchClient = algoliasearch(
    'SZJYGVO358',
    '783b59554c641f32e8d850a582930149'
  );
  type HitProps = {
    hit: AlgoliaHit<{
      name: string;
      price: number;
      description: string;
      brand: string;
      type: string;
      quantityInStock: string
    }>;
  };
  
  function Hit({ hit }: HitProps) {
    return (
      <>
        <Highlight hit={hit} attribute="name" className="Hit-label" />

        <p className="Hit-price">السعر: {hit.price}</p>
        <p className="Hit-price">التفاصيل : {hit.description}</p>
        <p className="Hit-brand">البراند: {hit.brand}</p>
        <p className="Hit-brand">النوع: {hit.type}</p>
        <p className="Hit-brand">الكميه: {hit.quantityInStock}</p>



      </>
    );
  }
  
export default function HomePage() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <>
            <Slider {...settings}>
                <div>
                    <img src="/images/hero1.jpg" alt="hero" style={{ display: 'block', width: '100%', maxHeight: 500 }} />
                </div>
                <div>
                    <img src="/images/hero2.jpg" alt="hero" style={{ display: 'block', width: '100%', maxHeight: 500 }} />
                </div>
                <div>
                    <img src="/images/hero3.jpg" alt="hero" style={{ display: 'block', width: '100%', maxHeight: 500 }} />
                </div>
            </Slider>
            <Box display='flex' justifyContent='center' sx={{ p: 4 }} >
                <Typography variant='h1'>
                    Welcome to the store!
                </Typography>
                
            </Box>
            <InstantSearch
      searchClient={searchClient}
      indexName="products"
      routing={true}
      insights={true}
    >

        <SearchBox placeholder="Search" autoFocus />
        <Tabs>
            <Tab title="Hits">
              <Hits hitComponent={Hit} />
              <Pagination className="Pagination" />
            </Tab>
            <Tab title="InfiniteHits">
              <InfiniteHits showPrevious hitComponent={Hit} />
            </Tab>
          </Tabs>
    </InstantSearch>
        </>
    )
}