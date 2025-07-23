import './styles/PaginationControls.css'
import clsx from "clsx";

const PaginationControls = ({page, pageNumbers, onPageChange}) => {
    return (
        <>
            <section className="favorites-pagination">
                <button
                    type="button"
                    className={clsx('page-num', 'arrow', 'fast', {
                        disabled: page === pageNumbers[0],
                    })}
                    data-page-num={pageNumbers[0]}
                    onClick={onPageChange}
                >
                    <span className="material-symbols-outlined">first_page</span>
                </button>

                <button
                    type="button"
                    className={clsx('page-num', 'arrow', {
                        disabled: page === pageNumbers[0],
                    })}
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
                        className={clsx(
                            typeof val === 'number' ? 'page-num' : 'dots',
                            {
                                active: typeof val === 'number' && page === val,
                            }
                        )}
                        onClick={onPageChange}
                    >
                        {val}
                    </button>
                ))}

                <button
                    type="button"
                    className={clsx('page-num', 'arrow', {
                        disabled: page === pageNumbers.at(-1),
                    })}
                    data-page-num={page + 1}
                    onClick={onPageChange}
                >
                    <span className="material-symbols-outlined">chevron_forward</span>
                </button>
                <button
                    type="button"
                    className={clsx('page-num', 'arrow', 'fast', {
                        disabled: page === pageNumbers.at(-1),
                    })}
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
