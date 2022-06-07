import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from "react-icons/fi"

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
    <div className={styles.container}>
      <div className={styles.postsContainer}>
        {
          postsPagination.results.map(post => {
            return (
              <div key={post.uid} className={styles.content}>
                <h1 className={styles.title}>{post.data.title}</h1>
                <h3 className={styles.subtitle}>{post.data.subtitle}</h3>
                <div className={styles.dateAndAuthor}>
                  <span className={styles.date}>
                    <FiCalendar size={20} />
                    {post.first_publication_date}
                  </span>
                  <span className={styles.author}>
                    <FiUser size={20} />
                    {post.data.author}
                  </span>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({})
  const postsResponse = await prismic.getByType('post', {
    pageSize: 1,
  });

  const posts: Post[] = postsResponse.results.map((post: Post) => {
    const { uid, first_publication_date, data: { title, subtitle, author } } = post
    const createdAt = new Date(first_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })

    return {
      uid,
      first_publication_date: createdAt,
      data: {
        title,
        subtitle,
        author
      }
    }
  })

  const postsPagination = {
    results: posts,
  }

  return {
    props: {
      postsPagination
    }
  }
};
