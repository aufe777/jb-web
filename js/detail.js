const postId = new URLSearchParams(window.location.search).get('id');
const categoryElement = document.querySelector('#post-category');
const titleElement = document.querySelector('#post-title');
const authorElement = document.querySelector('#post-author');
const createdAtElement = document.querySelector('#post-created-at');
const viewsElement = document.querySelector('#post-views');
const contentElement = document.querySelector('#post-content');
const postActions = document.querySelector('#post-actions');
const editLink = document.querySelector('#edit-link');
const deleteButton = document.querySelector('#delete-button');
let loadedPost = null;

function showLoadError(message) {
  titleElement.textContent = '게시글을 불러오지 못했습니다.';
  contentElement.textContent = message;
}

function renderPost(post) {
  loadedPost = post;
  categoryElement.textContent = post.category ?? '';
  titleElement.textContent = post.title ?? '';
  authorElement.textContent = post.author ?? '';
  createdAtElement.textContent = post.created_at ?? '';
  viewsElement.textContent = Number(post.views ?? 0).toLocaleString('ko-KR');

  contentElement.replaceChildren();
  const paragraph = document.createElement('p');
  String(post.content ?? '').split('\n').forEach((line, index) => {
    if (index > 0) paragraph.append(document.createElement('br'));
    paragraph.append(document.createTextNode(line));
  });
  contentElement.append(paragraph);
  editLink.href = `edit.html?id=${encodeURIComponent(post.id)}`;
  postActions.hidden = false;
  document.title = `${post.title ?? '게시글 상세'} | JB 게시판`;
}

deleteButton.addEventListener('click', async () => {
  if (!loadedPost || !confirm('이 게시글을 삭제하시겠습니까?')) return;

  deleteButton.disabled = true;
  try {
    const { error } = await supabaseClient
      .from('posts')
      .delete()
      .eq('id', postId)
      .select('id')
      .single();

    if (error) throw error;
    window.location.href = 'index.html';
  } catch (error) {
    console.error('게시글 삭제에 실패했습니다:', error);
    alert('게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    deleteButton.disabled = false;
  }
});

async function loadPost() {
  if (!postId) {
    showLoadError('게시글 ID가 없습니다. 목록으로 돌아가 게시글을 선택해주세요.');
    return;
  }

  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) {
    console.error('게시글을 불러오지 못했습니다:', error);
    showLoadError('게시글을 찾을 수 없거나 불러오는 중 문제가 발생했습니다.');
    return;
  }

  renderPost(data);
}

loadPost();
