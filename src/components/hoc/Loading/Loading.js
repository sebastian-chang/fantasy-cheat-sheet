import React from 'react';

// Replaces content while loading content
const Loading = (Component) => {
    return function WihLoadingComponent ({ isLoading, ...props }) {
        if (!isLoading) return <Component {...props} />
        return <p>Hold on, fetching data might take some time.</p>
    }
}
export default Loading