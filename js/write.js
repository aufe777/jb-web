const writeForm = document.querySelector('#write-form');
const formMessage = document.querySelector('#form-message');

writeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const post = {
    category: writeForm.elements.category.value.trim(),
    author: writeForm.elements.author.value.trim(),
    title: writeForm.elements.title.value.trim(),
    content: writeForm.elements.content.value.trim()
  };

  const hasEmptyValue = Object.values(post).some((value) => value === '');
  if (hasEmptyValue) {
    formMessage.textContent = '카테고리, 작성자, 제목, 내용을 모두 입력해주세요.';
    formMessage.hidden = false;
    return;
  }

  formMessage.hidden = true;
  const submitButton = writeForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const { error } = await supabaseClient
      .from('posts')
      .insert(post);

    if (error) throw error;
    window.location.href = 'index.html';
  } catch (error) {
    console.error('게시글 등록에 실패했습니다:', error);
    alert('게시글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    submitButton.disabled = false;
  }
});
