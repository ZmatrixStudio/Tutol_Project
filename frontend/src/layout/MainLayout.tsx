import Header from "./Header";
// import Footer from './Footer';
import NavMobile from './NavMoblie';
import Chat from './Chat';
import { Outlet } from "react-router-dom";


export default function MainLayout(){
    return (
        <div className="bg-[#F6F1F1] text-[#3D3333] antialiased selection:bg-[#C97474] selection:text-white">
            <div className="min-h-screen flex flex-col justify-between pb-16 md:pb-0">
                {/* Header */}
                <Header/>

                {/* Main */}
                <main>
                    <Outlet />
                </main>
                {/* Footer */}
                {/* <Footer/> */}
            </div>
            {/* navMobile */}
            <NavMobile/>
            {/* Chatbot */}
            <Chat/>
        </div>
    );
}