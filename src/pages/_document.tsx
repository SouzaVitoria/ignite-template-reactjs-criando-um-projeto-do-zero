import { Head } from 'next/document';

export default class MyDocument extends Document {
  render() {
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    </Head>
  }
}
