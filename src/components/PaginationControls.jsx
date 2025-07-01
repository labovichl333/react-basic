import React from 'react';
import './styles/PaginationControls.css'

const PaginationControls = ({page, pageNumbers, onPageChange}) => {
    return (
        <>
            <section className="favorites-pagination">
                <button
                    type="button"
                    className={
                        'page-num arrow fast' +
                        (page === pageNumbers[0] ? ' disabled' : '')
                    }
                    data-page-num={pageNumbers[0]}
                    onClick={onPageChange}
                >
                    <span className="material-symbols-outlined">first_page</span>
                </button>

                <button
                    type="button"
                    className={
                        'page-num arrow' + (page === pageNumbers[0] ? ' disabled' : '')
                    }
                    data-page-num={page - 1}
                    onClick={onPageChange}
                >
                    <span className="material-symbols-outlined">chevron_backward</span>
                </button>

                {pageNumbers.map((val, index) => (
                    <button
                        type="button"
                        data-page-num={typeof val === 'number' ? val : null}
                        key={'pageNum_' + index}
                        className={
                            typeof val === 'number'
                                ? 'page-num' + (page === val ? ' active' : '')
                                : 'dots'
                        }
                        onClick={onPageChange}
                    >
                        {val}
                    </button>
                ))}

                <button
                    type="button"
                    className={
                        'page-num arrow' +
                        (page === pageNumbers.at(-1) ? ' disabled' : '')
                    }
                    data-page-num={page + 1}
                    onClick={onPageChange}
                >
                    <span className="material-symbols-outlined">chevron_forward</span>
                </button>
                <button
                    type="button"
                    className={
                        'page-num arrow fast' +
                        (page === pageNumbers.at(-1) ? ' disabled' : '')
                    }
                    data-page-num={pageNumbers.at(-1)}
                    onClick={onPageChange}
                >
                    <span className="material-symbols-outlined">last_page</span>
                </button>
            </section>
        </>

    );
};

export default PaginationControls;