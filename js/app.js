let posts = [];

const postList = document.querySelector('#post-list');
const searchInput = document.querySelector('#search');
const categorySelect = document.querySelector('#category');
const searchForm = searchInput.closest('form');

const categoryLabels = {
  notice: '공지',
  free: '자유',
  question: '질문',
  share: '정보 공유'
};

function createCell(value) {
  const cell = document.createElement('td');
  cell.textContent = value ?? '';
  return cell;
}

function formatCreatedAt(value) {
  const date = String(value ?? '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.replaceAll('-', '.') : value ?? '';
}

function renderPosts(data = posts) {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const selectedCategory = categorySelect.value;
  const filteredPosts = data.filter((post) => {
    const selectedLabel = categoryLabels[selectedCategory];
    const matchesCategory = selectedCategory === 'all'
      || post.category === selectedCategory
      || post.category === selectedLabel;
    const matchesSearch = !query
      || `${post.title ?? ''} ${post.content ?? ''}`.toLocaleLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  postList.replaceChildren();

  filteredPosts.forEach((post) => {
    const row = document.createElement('tr');
    const categoryName = categoryLabels[post.category] ?? post.category;
    row.append(createCell(post.id), createCell(categoryName));

    const titleCell = document.createElement('td');
    const titleLink = document.createElement('a');
    titleLink.href = `detail.html?id=${encodeURIComponent(post.id)}`;
    titleLink.textContent = post.title ?? '';
    titleCell.append(titleLink);
    row.append(titleCell);

    row.append(
      createCell(post.author),
      createCell(formatCreatedAt(post.created_at)),
      createCell(post.views)
    );
    postList.append(row);
  });
}

async function loadPosts() {
  const { data, error } = await supabaseClient
    .from('posts')
    .select('id, category, title, content, author, views, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('게시글을 불러오지 못했습니다:', error);
    posts = [];
    renderPosts(posts);
    return;
  }

  posts = data ?? [];
  renderPosts(posts);
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPosts(posts);
});

searchInput.addEventListener('input', () => renderPosts(posts));
categorySelect.addEventListener('change', () => renderPosts(posts));

loadPosts();
