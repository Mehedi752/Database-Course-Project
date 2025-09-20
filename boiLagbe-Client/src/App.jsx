import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import ChatbotWidget from './chatbot/ChatbotWidget';

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
            <ChatbotWidget />
        </div>
    );
};

export default MainLayout;