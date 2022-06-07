import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <div>
      {/* {
        postsPagination.results.map(post => {
          return (
            <>
              <h1>{post.data.title}</h1>
              <h3>{post.data.subtitle}</h3>
            </>
          )
        })
      } */}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({})
  const response = await prismic.getByType('post', {
    pageSize: 1,
  });
  console.log(response)

  // const posts: Post[] = postsResponse.results.map((post: Post) => {
  //   const { uid, first_publication_date } = post
  //   const { title, subtitle, author } = post.data
  //   const createdAt = new Date(first_publication_date).toLocaleDateString("pt-BR", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric"
  //   })

  //   return {
  //     uid,
  //     first_publication_date: createdAt,
  //     data: {
  //       title,
  //       subtitle,
  //       author
  //     }
  //   }
  // })

  // const postsPagination: PostPagination = {
  //   next_page: postsResponse.next_page,
  //   results: posts,
  // }

  return {
    props: {

    }
  }
};
