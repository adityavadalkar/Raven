import React from 'react';

function Avatar({ name='', size = 40 }) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    color: '#fff',
    fontSize: `${size * 0.5}px`,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  };

  return <div style={avatarStyle}>{initials}</div>;
}

export default Avatar;
