import React from 'react';
import Header from '../../../components/Header';
import FeesManagement from '../../../components/FeesManagement';

function RectorFees() {
    return (
        <>
            <Header title="Fees Management" />
            <FeesManagement role="rector" />
        </>
    );
}

export default RectorFees;
