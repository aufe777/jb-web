const postId = new URLSearchParams(window.location.search).get('id');
const editForm = document.querySelector('#edit-form');
const formMessage = document.querySelector('#form-message');
const cancelLink = document.querySelector('#cancel-link');
const submitButton = editForm.querySelector('button[type="submit"]');

if (postId) cancelLink.href = `detail.html?id=${encodeURIComponent(postId)}`;

async function loadPostForEdit() {
  if (!postId) {
    formMessage.textContent = '게시글 ID가 없습니다. 목록으로 돌아가 다시 선택해주세요.';
    formMessage.hidden = false;
    editForm.querySelectorAll('input, select, textarea, button').forEach((field) => {
      field.disabled = true;
    });
    return;
  }

  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) {
    console.error('게시글을 불러오지 못했습니다:', error);
    formMessage.textContent = '게시글을 불러오지 못했습니다. 목록으로 돌아가 다시 시도해주세요.';
    formMessage.hidden = false;
    editForm.querySelectorAll('input, select, textarea, button').forEach((field) => {
      field.disabled = true;
    });
    return;
  }

  editForm.elements.category.value = data.category ?? '';
  editForm.elements.author.value = data.author ?? '';
  editForm.elements.title.value = data.title ?? '';
  editForm.elements.content.value = data.content ?? '';
}

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const updatedPost = {
    category: editForm.elements.category.value.trim(),
    author: editForm.elements.author.value.trim(),
    title: editForm.elements.title.value.trim(),
    content: editForm.elements.content.value.trim()
  };

  if (Object.values(updatedPost).some((value) => value === '')) {
    formMessage.textContent = '카테고리, 작성자, 제목, 내용을 모두 입력해주세요.';
    formMessage.hidden = false;
    return;
  }

  formMessage.hidden = true;
  submitButton.disabled = true;

  try {
    const { error } = await supabaseClient
      .from('posts')
      .update(updatedPost)
      .eq('id', postId)
      .select('id')
      .single();

    if (error) throw error;
    window.location.href = `detail.html?id=${encodeURIComponent(postId)}`;
  } catch (error) {
    console.error('게시글 수정에 실패했습니다:', error);
    alert('게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    submitButton.disabled = false;
  }
});

loadPostForEdit();
