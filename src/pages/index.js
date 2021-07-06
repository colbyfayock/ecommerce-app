import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script';
import Link from 'next/link';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss'

export default function Home({ products }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.css" />
      </Head>

      <Header />

      <main>
        <Container>
          <h1>Hyper Bros. Trading Cards</h1>
          <h2>Available Cards</h2>
          <ul className={styles.products}>
            {products.map(product => {
              const { featuredImage } = product;
              return (
                <li key={product.id}>
                  <Link href={`/products/${product.slug}`}>
                    <a>
                      <Image width={featuredImage.mediaDetails.width} height={featuredImage.mediaDetails.height} src={featuredImage.sourceUrl} alt={featuredImage.altText} />
                      <h3 className={styles.productTitle}>
                        { product.title }
                      </h3>
                      <p className={styles.productPrice}>
                        ${ product.productPrice }
                      </p>
                    </a>
                  </Link>
                  <p>
                    <Button
                      className="snipcart-add-item"
                      data-item-id={product.productId}
                      data-item-price={product.productPrice}
                      data-item-url="/"
                      data-item-description=""
                      data-item-image={featuredImage.sourceUrl}
                      data-item-name={product.title}
                    >
                      Add to Cart
                    </Button>
                  </p>
                </li>
              )
            })}
          </ul>
        </Container>
      </main>

      <footer className={styles.footer}>
        &copy; Hyper Bros. Trading Cards, {new Date().getFullYear()}
      </footer>

      <Script src="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js" />
      <div hidden id="snipcart" data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY} />
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://hyperbros.wpengine.com/graphql',
    cache: new InMemoryCache()
  });

  const response = await client.query({
    query: gql`
      query AllProducts {
        products {
          edges {
            node {
              id
              content
              title
              uri
              product {
                productPrice
                productId
              }
              slug
              featuredImage {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
            }
          }
        }
      }
    `
  });

  const products = response.data.products.edges.map(({ node }) => {
    const data = {
      ...node,
      ...node.product,
      featuredImage: {
        ...node.featuredImage.node
      }
    }
    return data;
  })

  return {
    props: {
      products
    }
  }
}