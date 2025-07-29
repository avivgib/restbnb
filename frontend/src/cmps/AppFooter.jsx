import { useSelector } from 'react-redux'

export function AppFooter() {
    const count = useSelector(storeState => storeState.userModule.count)

    return (
        <footer className="app-footer main-container full">
            <section className="main-content">
                <div className="left">
                <p>&copy; 2025 Restbnb, Inc. · Michael · Aviv · Naama</p>
                {/* <p>Count: {count}</p> */}
                </div>
                <div className="right">
                    <a href="https://github.com/MichaelFlaischer/restBNB-front"><img src="/img/github-logo.png" alt="github-logo"></img></a>
                    
                </div>
            </section>
        </footer>
    )
}