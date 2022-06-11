import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  return (
    <h1> {post.data.title} </h1>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType("post");

  return {
    paths: [],
    fallback: "blocking"
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID("post", params.slug);
  const { first_publication_date, data: { author, title, banner: { url }, content } } = response

  const contents = content.map(current => {
    return {
      heading: current.heading,
      body: RichText.asHtml(current.body)
    }
  })

  const post: Post = {
    first_publication_date,
    data: {
      author,
      title,
      banner: {
        url
      },
      content: contents
    }
  }

  return {
    props: {
      post
    }
  }
};
