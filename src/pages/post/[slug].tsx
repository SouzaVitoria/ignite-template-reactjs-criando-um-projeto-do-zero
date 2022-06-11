import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

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
  const route = useRouter();
  const { first_publication_date, data: { title, banner: { url }, author, content } } = post
  const characterPorMinuts = 200;

  const totalCharacterBody = content.reduce((total: number, current) => {
    const characterHeadingTotal = current.heading.split(' ').length
    const totalBody = RichText.asText(current.body).split(' ').length;
    return (total += characterHeadingTotal + totalBody);
  }, 0);

  const readingTime = Math.round(totalCharacterBody / characterPorMinuts)


  function formattedDate(date: string): string {
    return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
  }

  if (route.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <img src={url} alt={title} className={styles.full} />
      <div className={commonStyles.content}>
        <h1 className={`${commonStyles.title} ${styles.title}`}> {title} </h1>
        <div className={commonStyles.info}>
          <span className={commonStyles.date}>
            <FiCalendar size={20} />
            {formattedDate(first_publication_date)}
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
              <div key={current.heading}>
                <h2 className={styles.subtitles}> {current.heading} </h2>
                <div dangerouslySetInnerHTML={{ __html: RichText.asHtml(current.body) }} />
              </div>
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

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid }
    }
  })

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID("post", params.slug);
  const { first_publication_date, data: { author, title, banner: { url }, content } } = response

  const contents = await content.map(current => {
    return {
      heading: current.heading,
      body: current.body
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
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
};
