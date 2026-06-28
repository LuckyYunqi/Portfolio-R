const filterButtons = document.querySelectorAll('[data-filter]');
const taskCards = document.querySelectorAll('.task-card[data-type]');
const modal = document.getElementById('taskModal');
const modalTriggers = document.querySelectorAll('[data-open-modal]');
const filterModal = document.getElementById('filterModal');
const detailModal = document.getElementById('detailModal');
const moreModal = document.getElementById('moreModal');

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

document.querySelectorAll('[data-open-filter]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
        if (filterModal?.showModal) {
            filterModal.showModal();
        }
    });
});

document.querySelectorAll('[data-open-detail]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
        if (moreModal?.open) {
            moreModal.close();
        }

        if (detailModal?.showModal) {
            detailModal.showModal();
        }
    });
});

document.querySelectorAll('[data-open-more]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
        if (moreModal?.showModal) {
            moreModal.showModal();
        }
    });
});

document.querySelectorAll('.segmented-control').forEach((group) => {
    group.addEventListener('click', (event) => {
        const selected = event.target.closest('button');

        if (!selected) {
            return;
        }

        group.querySelectorAll('button').forEach((button) => {
            button.classList.toggle('active', button === selected);
        });
    });
});

document.querySelectorAll('.toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
    });
});
