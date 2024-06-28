import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <TailSpin
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );


};


export default LoadingSpinner;
