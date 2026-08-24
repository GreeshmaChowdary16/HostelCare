import React from 'react';
import Header from '../../../components/Header';
import FeesManagement from '../../../components/FeesManagement';

function AdminFees() {
    return (
        <>
            <Header title="Fees Management" />
            <FeesManagement role="admin" />
        </>
    );
}

export default AdminFees;
