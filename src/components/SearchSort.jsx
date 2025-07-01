import './styles/SearchSort.css';
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

const SearchSort = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParams.get('query') || '');

    useEffect(() => {

        setInputValue(searchParams.get('query') || '');
    }, [searchParams.get('query')]);

    function handleSortChange(e) {

        const params = new URLSearchParams(searchParams)

        const sortField = e.currentTarget.dataset.sort;

        let sort = sortField, order = 'asc';

        if (sortField === searchParams.get('sort')) {
            if (searchParams.get('order') === 'asc') {
                order = 'desc';
                sort = sortField;
            } else {
                order = null;
                sort = null;
            }
        }

        if (order === null || sort === null) {
            params.delete('sort')
            params.delete('order')
        } else {
            params.set('sort', sort)
            params.set('order', order)
        }

        setSearchParams(params);
    }

    function changeQuery(value) {

        const params = new URLSearchParams(searchParams)

        if (value) {
            params.set('query', value)
        } else {
            params.delete('query')
        }
        setSearchParams(params);
    }

    return (
        <section className="sort-search-container">
            <div className="sort-wrapper">
                <div className="sort-title">Sorting:</div>
                <div className="sort-fields">
                    <div
                        data-sort="views"
                        className={
                            'sort-field' + (searchParams.get('sort') === 'views' ? ' active' : '')
                        }
                        onClick={handleSortChange}
                    >

                        <span className="material-symbols-outlined">visibility</span>


                        {searchParams.get('sort') !== 'views' && (
                            <span className="material-symbols-outlined sort-icon">
                sync_alt
              </span>
                        )}

                        {searchParams.get('sort') === 'views' && searchParams.get('order') === 'asc' && (
                            <span className="material-symbols-outlined">straight</span>
                        )}

                        {searchParams.get('sort') === 'views' && searchParams.get('order') === 'desc' && (
                            <span data-order="desc" className="material-symbols-outlined">
                straight
              </span>
                        )}
                    </div>
                    <div
                        data-sort="likes"
                        className={
                            'sort-field' + (searchParams.get('sort') === 'likes' ? ' active' : '')
                        }
                        onClick={handleSortChange}
                    >
                        <span className="material-symbols-outlined">thumb_up</span>

                        {searchParams.get('sort') !== 'likes' && (
                            <span className="material-symbols-outlined sort-icon">
                sync_alt
              </span>
                        )}

                        {searchParams.get('sort') === 'likes' && searchParams.get('order') === 'asc' && (
                            <span className="material-symbols-outlined">straight</span>
                        )}

                        {searchParams.get('sort') === 'likes' && searchParams.get('order') === 'desc' && (
                            <span data-order="desc" className="material-symbols-outlined">
                straight
              </span>
                        )}
                    </div>
                </div>
            </div>
            <form className="search-wrapper" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search">
                    <span className="material-symbols-outlined">search</span>
                </label>
                <input
                    type="text"
                    id="search"
                    value={inputValue}
                    placeholder="Search..."
                    onChange={(e) => changeQuery(e.target.value)}
                />
                {searchParams.get('query') && (
                    <button type="reset" onClick={() => {
                        changeQuery("")
                    }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </form>
        </section>
    );
}

export default SearchSort;
