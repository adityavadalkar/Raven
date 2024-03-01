import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Home from '../components/Home';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

const middlewares = [thunk]

const mockStore = configureStore(middlewares);