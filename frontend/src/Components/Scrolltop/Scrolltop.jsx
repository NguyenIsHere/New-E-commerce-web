import {React, useState, useEffect }from 'react'
import './Scrolltop.css'


const Scrolltop = () => {

    const scrollTop = () =>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const [showScroll, setShowScroll] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            document.body.scrollTop > 27 || document.documentElement.scrollTop > 27 ? setShowScroll(true) : setShowScroll(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            { showScroll===true 
            ? <div onClick={scrollTop} className="scroll-btn"> <div>Top</div> </div>
            :<></>}
        </div>
        
        
    )
}

export default Scrolltop