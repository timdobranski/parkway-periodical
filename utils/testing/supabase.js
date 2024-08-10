import { createClient } from '../supabase/client';
import dotenv from 'dotenv';

dotenv.config();

const TESTING_EMAIL = process.env.NEXT_TESTING_EMAIL;
const TESTING_PASSWORD = process.env.NEXT_TESTING_PASSWORD;

const supabase = createClient();

export async function signIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: TESTING_EMAIL,
    password: TESTING_PASSWORD,
  });

  if (error) {
    console.error('Error signing in:', error);
  } else {
    console.log('Signed in successfully:');
  }
}

export async function clearPostsTable() {
  await supabase.from('posts').delete().neq('id', '0');
}
export async function clearDraftsTable() {
  await supabase.from('drafts').delete().eq('id', '1'); // delete any drafts associated with the test user
}

export async function insertPost(post) {
  await supabase.from('posts').insert([post]);
}

export async function setupDatabaseWithPostId5() {
  await signIn();
  await clearPostsTable();
  await clearDraftsTable();

  const existingPostWithId5 = {
    id: 5,
    content: JSON.stringify([{"type":"title","content":"Test Post #5","style":{"width":"0px","height":"0px","x":0,"y":0},"author":1}]),
    author: '1',
    title: 'Test Post #5',
    searchableText: 'Test Post #5',
    schoolYear: '2024-25',
  };

  await insertPost(existingPostWithId5);
}


const postContentWithAllContentBlocks = {
  content: "[{\"type\":\"title\",\"content\":\"Test Post of All Content Types\",\"style\":{\"width\":\"0px\",\"height\":\"0px\",\"x\":0,\"y\":0}},{\"type\":\"text\",\"content\":\"<p class=\\\"ql-align-center\\\">This is a demonstration of all current content capabilities of the post editor. It's not designed to look particularly nice, only to demonstrate options and test that all options render in the expected way.</p>\"},{\"type\":\"text\",\"content\":\"<p class=\\\"ql-align-center\\\"><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">Text can be </span><strong style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">bold,</strong><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\"> </span><em style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">italic,</em><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\"> or </span><u style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">underlined.</u></p><p class=\\\"ql-align-center\\\"><br></p><p class=\\\"ql-align-center\\\"><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">It can be </span><span style=\\\"background-color: transparent; color: rgb(224, 102, 102);\\\">70 different colors</span><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">, or </span><span style=\\\"background-color: rgb(234, 153, 153); color: rgb(75, 85, 99);\\\">highlighted in 70 different colors.</span></p><p class=\\\"ql-align-center\\\"><br></p><p class=\\\"ql-align-center\\\"><span class=\\\"ql-size-small\\\" style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">Smaller text looks like this.</span></p><p class=\\\"ql-align-center\\\"><br></p><p class=\\\"ql-align-center\\\"><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">Regular text looks like this.</span></p><p class=\\\"ql-align-center\\\"><br></p><p class=\\\"ql-align-center\\\"><span class=\\\"ql-size-large\\\" style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">Large text looks like this.</span></p><p class=\\\"ql-align-center\\\"><br></p><p class=\\\"ql-align-center\\\"><span class=\\\"ql-size-huge\\\" style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">Huge text looks like this.</span></p><p class=\\\"ql-align-center\\\"><br></p><p class=\\\"ql-align-center\\\"><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">You can add</span><a href=\\\"http://timdobranski.com/\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\" style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\"> </a><u style=\\\"background-color: transparent; color: rgb(0, 102, 204);\\\"><a href=\\\"http://timdobranski.com/\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\">links</a></u><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\"> to your text</span></p><p><br></p><p class=\\\"ql-align-center\\\"><span style=\\\"background-color: transparent; color: rgb(75, 85, 99);\\\">And you can format it to the left, right, or center</span></p>\"},{\"type\":\"photo\",\"content\":[{\"src\":\"http://127.0.0.1:54321/storage/v1/object/public/posts/photos/894isfnlszt.webp\",\"caption\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\",\"title\":\"Cropped And Resized Photo Title\",\"fileName\":\"894isfnlszt.webp\",\"style\":{\"width\":\"169px\"}}],\"format\":\"single-photo-no-caption\"},{\"type\":\"video\",\"content\":[{\"url\":\"https://www.youtube.com/embed/A-F1mVWLVaQ\",\"title\":\"Video Title\",\"caption\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\",\"orientation\":\"landscape\",\"style\":{\"width\":\"58.9602%\",\"height\":\"auto\",\"maxHeight\":\"50vh\",\"paddingBottom\":\"33.1651125%\"}}]},{\"type\":\"carousel\",\"content\":[{\"src\":\"http://127.0.0.1:54321/storage/v1/object/public/posts/photos/9txnxoptnd.webp\",\"caption\":false,\"title\":false,\"fileName\":\"9txnxoptnd.webp\"},{\"src\":\"http://127.0.0.1:54321/storage/v1/object/public/posts/photos/lx774ehpfmo.webp\",\"caption\":false,\"title\":false,\"fileName\":\"lx774ehpfmo.webp\"},{\"src\":\"http://127.0.0.1:54321/storage/v1/object/public/posts/photos/w38pamj1u9.webp\",\"caption\":false,\"title\":false,\"fileName\":\"w38pamj1u9.webp\"}],\"format\":\"carousel\"},{\"type\":\"flexibleLayout\",\"content\":[{\"type\":\"video\",\"content\":[{\"url\":\"https://www.youtube.com/embed/0tZD8PLzg6U\",\"title\":\"Layout Video Title\",\"caption\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \",\"orientation\":\"landscape\",\"style\":{\"width\":\"100%\",\"height\":\"auto\",\"x\":325,\"y\":0,\"maxHeight\":\"50vh\"}}]},{\"type\":\"text\",\"content\":\"<p class=\\\"ql-align-center\\\"><span style=\\\"color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);\\\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </span></p>\",\"caption\":false,\"title\":false},{\"type\":\"photo\",\"content\":[{\"src\":\"http://127.0.0.1:54321/storage/v1/object/public/posts/photos/vvy1mxw2xu.webp\",\"caption\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \",\"title\":\"Layout Photo Title\",\"fileName\":\"vvy1mxw2xu.webp\"}],\"style\":{\"width\":\"100%\",\"height\":\"auto\",\"x\":0,\"y\":0,\"maxHeight\":\"50vh\"},\"format\":\"single-photo-no-caption\"}]}]",
  searchableText: `Test Post of All Content Types This is a demonstration of all current content capabilities of the post editor. It's not designed to look particularly nice, only to demonstrate options and test that all options render in the expected way. Text can be bold, italic, or underlined.It can be 70 different colors, or highlighted in 70 different colors.Smaller text looks like this.Regular text looks like this.Large text looks like this.Huge text looks like this.You can add links to your textAnd you can format it to the left, right, or center Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Cropped And Resized Photo Title`,
  id: 5,
  author: '1',
  schoolYear: '2024-25',
  title: 'Test Post of All Content Types'
}