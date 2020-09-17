import React from 'react';

const Loading = (Component) => {
    return function WihLoadingComponent ({ isLoading, ...props }) {
        if (!isLoading) return <Component {...props} />
        return <p>Hold on, fetching data might take some time.</p>
    }
}
export default Loading