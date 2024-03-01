import React from 'react'
import { Stack, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='mt-4' style={{borderTop: "1px solid #d2d2d2", padding: "5rem 4rem", gap: "4.625rem"}}>
        <Stack direction='horizontal'>
            <Link to="/"  className='me-auto'><Image src='/logo-footer.svg' style={{height: '2vh'}}/></Link>
            <Link to="https://www.linkedin.com/company/ravenstyleinfo/" target='_blank' className='ms-auto' ><Image src='/socials/linkedin.svg'style={{height: '2vh'}}/></Link>
            <Link to="https://discord.gg/Zrp5dt5Q64" target='_blank'><Image src='/socials/discord.svg' className='mx-2' style={{height: '2vh'}}/></Link>
        </Stack>
        <hr style={{marginTop: "4rem"}}/>
        <Stack direction='horizontal' className='d-flex justify-content-center my-4' style={{textDecoration: "underline", gap: "2rem"}}>
            <p className=''>2023 Raven. All rights reserved.</p>
            {/* <Link to="/privacy"><b>Privacy Policy</b></Link>
            <Link to="/terms"><b>Terms of Service</b></Link>
            <Link to="/cookies"><b>Cookie Settings</b></Link> */}
        </Stack>
    </div>
  )
}

export default Footer