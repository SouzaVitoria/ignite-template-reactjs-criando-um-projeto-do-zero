import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

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
  totalCharacterBody: number;
}

export default function Post({ post, totalCharacterBody }: PostProps) {
  const { first_publication_date, data: { title, banner: { url }, author, content } } = post
  const characterPorMinuts = 200;
  const readingTime = Math.round(totalCharacterBody / characterPorMinuts)

  return (
    <div className={styles.container}>
      <img src={url} alt={title} className={styles.full} />
      <div className={commonStyles.content}>
        <h1 className={`${commonStyles.title} ${styles.title}`}> {title} </h1>
        <div className={commonStyles.info}>
          <span className={commonStyles.date}>
            <FiCalendar size={20} />
            {first_publication_date}
          </span>
          <span className={commonStyles.author}>
            <FiUser size={20} />
            {author}
          </span>
          <span>
            <FiClock size={20} />
            {readingTime} min
          </span>
        </div>
        <main className={styles.content}>
          {content.map(current => {
            return (
              <>
                <h2 className={styles.subtitles}> {current.heading} </h2>
                <div dangerouslySetInnerHTML={{ __html: current.body }} />
              </>
            )
          })}
        </main>
      </div>

    </div>
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
  const date = new Date(first_publication_date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
  const contents = content.map(current => {
    return {
      heading: current.heading,
      body: RichText.asHtml(current.body)
    }
  })

  const post: Post = {
    first_publication_date: date,
    data: {
      author,
      title,
      banner: {
        url
      },
      content: contents
    }
  }

  const totalCharacterBody = content.reduce((total: number, current) => {
    const characterHeadingTotal = current.heading.split(' ').length
    const totalBody = RichText.asText(current.body).split(' ').length;
    return (total += characterHeadingTotal + totalBody);
  }, 0);

  return {
    props: {
      post,
      totalCharacterBody
    }
  }
};
