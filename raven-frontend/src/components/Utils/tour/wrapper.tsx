import Joyride, { CallBackProps } from 'react-joyride';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMount } from 'react-use';
import React from 'react';
import { useAppState } from './context';

export default function MultiRouteWrapper() {
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useAppState();
  const navigate = useNavigate();

  useMount(() => {
    setState({
      steps: [
        {
          target: 'body',
          content: (
            <div>
              <h3 className='text-start'>A quick tour to the site?</h3>
              <p className='text-start'>Learn how we can be of service.</p>
            </div>
          ),
          disableBeacon: true,
          placement: 'center',
          locale: {
            next: 'Start',
            placement: 'center',
            skip: 'Skip the tour',
          },
          showProgress: false,
        },
        {
          target: '.step-1',
          title: <p className='text-start'><b>Select an outfit image</b></p>,
          content: <p className='text-start'>Select an image and see more outfits like this.</p>,
        },
        {
          target: '.step-2',
          title: <p className='text-start'><b>Favorite an item</b></p>,
          content: <p className='text-start'>Tap here to mark your favorites.</p>,
        },
        {
          target: '.step-3',
          title: <p className='text-start'><b>Not interested?</b></p>,
          content: <p className='text-start'>Tap here and we will remove this product for you.</p>,
        },
        {
          target: '.step-4',
          title: <p className='text-start'><b>Generate more outfits</b></p>,
          content: <p className='text-start'>Tap here and we will bring other options to you.</p>,
        },
        {
          target: '.step-5',
          title: <p className='text-start'><b>More like this item?</b></p>,
          content: <p className='text-start'>We will find similar items for your consideration.</p>,
        },
        {
          target: '.step-6',
          title: <p className='text-start'><b>Last step!</b></p>,
          content: <p className='text-start'>Get this item directly at our collaborated stores!</p>,
        },
      ],
    });
  });

  const handleCallback = (data: CallBackProps) => {
    const { action, index, lifecycle, type } = data;
    // console.log(type, action, index, lifecycle)
    if (type === 'step:after' && action === 'next' && index === 1) {
      setState({ run: false });
      const state = {
        style_name: "Denim Diplomat"
      };
      navigate('/outfits?style=64d2fb8fc6ab3418761fc2e8', { state });
      setTimeout(() => {
        setState({ run: true, stepIndex: 2 });
      }, 1200);
    }
    if(action === 'next' && type === 'step:after') {
      setState({ stepIndex: index + 1 });
    }
    else if(action === 'prev' && type === 'step:after') {
      if(index === 2){
        setState({ run: false });
        navigate('/');
        setTimeout(() => {
          setState({ run: true, stepIndex: 1});
        }, 1200);
      }
      else{
        setState({ stepIndex: index - 1 });
      }
    }
    if(action === 'close' || action === 'skip' || type === 'tour:end'){
      setState({ run: false, tourActive: false });
      navigate('/');
      localStorage.setItem('showTour', 'false');
    }
  };
  

  return (
    <div>
      <Outlet />
      <Joyride
        callback={handleCallback}
        continuous
        showProgress
        showSkipButton
        run={run}
        stepIndex={stepIndex}
        steps={steps}
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#fff',
            primaryColor: '#000',
            textColor: '#000',
            zIndex: 1000,
          },
        }}
      />
    </div>
  );
}
