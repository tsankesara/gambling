import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Layout = ({ children }) => {
	return (
		<div>
			{/* Add Header */}
			<h1>Header</h1>
			{children}
			<h1>Footer</h1>
			{/* Add Footer */}
		</div>
	);
};

export default Layout;
