const filterButtons = document.querySelectorAll('[data-filter]');
const taskCards = document.querySelectorAll('.task-card[data-type]');
const modal = document.getElementById('taskModal');
const modalTriggers = document.querySelectorAll('[data-open-modal]');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.toggle('active', item === button));
        taskCards.forEach((card) => {
            const shouldShow = filter === 'all' || card.dataset.type === filter;
            card.classList.toggle('is-hidden', !shouldShow);
        });
    });
});

modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        if (modal?.showModal) {
            modal.showModal();
        }
    });
});

document.querySelectorAll('.toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
    });
});
