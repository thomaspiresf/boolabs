import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';

const products = [
  { id: 'boobot', name: 'boobot', iconOn: '/boobot-on.png', iconOff: '/boobot-off.png' },
  { id: 'spyboo', name: 'spyboo', iconOn: '/spyboo-on.png', iconOff: '/spyboo-off.png' },
  { id: 'booska', name: 'booska', iconOn: '/booska-on.png', iconOff: '/booska-off.png' },
  { id: 'boompredict', name: 'boom predict', iconOn: '/boom-predict-on.png', iconOff: '/boom-predict-off.png' },
  { id: 'dashboo', name: 'dashboo', iconOn: '/dashboo-on.png', iconOff: '/dashboo-off.png' },
];

export const ProductSelector = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex justify-center w-full">
      <div className="bg-[#D1D8E5]/40 backdrop-blur-md px-3 md:px-5 py-2.5 rounded-full flex items-center justify-between md:justify-center w-full md:w-auto gap-1 md:gap-6 shadow-sm border border-white/20 px-[2%] md:px-5">
        {products.map((p) => {
          const isActive = id === p.id;
          return (
            <Link
              key={p.id}
              to={`/produto/${p.id}`}
              className="relative flex items-center justify-center group flex-1 md:flex-none"
            >
              <motion.div
                whileHover={{ scale: 1.15, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <div className="relative w-11 h-11 md:w-14 md:h-14">
                  {/* Off Icon (Base) */}
                  <img
                    src={p.iconOff}
                    alt={p.name}
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ${
                      isActive ? 'opacity-0' : 'opacity-40 group-hover:opacity-80'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {/* On Icon (Overlay) */}
                  <img
                    src={p.iconOn}
                    alt={p.name}
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ${
                      isActive ? 'opacity-100 scale-105' : 'opacity-0'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="active-indicator-glow"
                  className="absolute -inset-1 bg-white/10 rounded-full blur-sm"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
