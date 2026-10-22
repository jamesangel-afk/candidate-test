import { debounce } from "lodash";
import { useEffect, useState, useCallback } from "react";
import "./DocumentDashboard.css";

export default function DocumentDashboard() {
    const [docs, setDocs] = useState();
    const [searchTerm, setSearchTerm] = useState();
    const [loading, setLoading] = useState(false);

    const filteredDocs = docs.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSearchDebounced = useCallback(() =>
        debounce(value => {
            setSearchTerm(value);
        }, 300)
    );

    const onSearchChange = e => {
        handleSearchDebounced(e.target.value);
    };

    useEffect(() => {
        fetch("/api/documents")
            .then(res => res.json())
            .then(data => {
                setLoading(true);
                setDocs(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="dashboard">
            <h1>Document Dashboard</h1>
            <div className="search-bar">
                <input type="text" placeholder="Search documents…" onChange={onSearchChange} />
                <button onClick={setSearchTerm("")}>Clear Search</button>
            </div>

            {loading && <p className="loading">Loading documents…</p>}

            <ul className="doc-list">
                {filteredDocs.map(doc => (
                    <li>{doc.title}</li>
                ))}
            </ul>
        </div>
    );
}
