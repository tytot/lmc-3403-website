export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    The Programmer's Guide to Using AI
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/task/01">
                                Task 1
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="/task/02" aria-disabled="true">
                                Task 2
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="/task/03" aria-disabled="true">
                                Task 3
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
