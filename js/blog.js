import { posts } from './blog-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const postsList = document.getElementById('posts-list');

  function renderPosts(items) {
    postsList.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <div class="post-content">
          <h3>${p.title}</h3>
          <div class="meta">${p.author} · ${p.date}</div>
          <p class="excerpt">${p.excerpt}</p>
          <div class="full-content" aria-hidden="true">${p.content}</div>
          <a href="#" class="read-more" data-id="${p.id}">Leer más</a>
        </div>
      `;
      postsList.appendChild(card);
    });
  }

  renderPosts(posts);

  postsList.addEventListener('click', (e) => {
    const btn = e.target.closest('.read-more');
    if (!btn) return;
    e.preventDefault();
    const id = parseInt(btn.dataset.id);
    const post = posts.find(x => x.id === id);
    if (post) {
      const card = btn.closest('.post-card');
      const full = card.querySelector('.full-content');
      if (!full) return;
      const isHidden = full.getAttribute('aria-hidden') === 'true';
      if (isHidden) {
        full.setAttribute('aria-hidden', 'false');
        full.style.maxHeight = full.scrollHeight + 'px';
        btn.textContent = 'Mostrar menos';
      } else {
        full.setAttribute('aria-hidden', 'true');
        full.style.maxHeight = '0px';
        btn.textContent = 'Leer más';
      }
    }
  });
});
