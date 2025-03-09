#!/usr/bin/env node
import { program } from 'commander';

program
  .argument('<number>', 'Specify the number to run a specific main', parseInt)
  .action(async (number) => {
    try {
      let mainFunction;
      
      // Dynamically import the correct main function based on the number
      if (number === 5) {
        mainFunction  = (await import('./solutions/day05.js')).day05main;
      } else if (number === 6) {
        mainFunction = (await import('./solutions/day06.js')).day06main;
      } else if (number === 7) {
        mainFunction = (await import('./solutions/day07.js')).day07main;
      } else if (number === 8) {
        mainFunction = (await import('./solutions/day08.js')).day08main;
      }else if (number === 9) {
        mainFunction = (await import('./solutions/day09.js')).day09main;
      }else if (number === 10) {
        mainFunction = (await import('./solutions/day10.js')).day10main;
      }else if (number === 11) {
        mainFunction = (await import('./solutions/day11.js')).day11main;
      }else if (number === 12) {
        mainFunction = (await import('./solutions/day12.js')).day12main;
      }else if (number === 13) {
        mainFunction = (await import('./solutions/day13.js')).day13main;
      } else if (number === 14) {
        mainFunction = (await import('./solutions/day14.js')).day14main;
      } else if (number === 15) {
        mainFunction = (await import('./solutions/day15.js')).day15main;
      } else if (number === 16) {
        mainFunction = (await import('./solutions/day16.js')).day16main;
      } else if (number === 17) {
        mainFunction = (await import('./solutions/day17.js')).day17main;
      }  else if (number === 18) {
        mainFunction = (await import('./solutions/day18.js')).day18main;
      }  else if (number === 19) {
        mainFunction = (await import('./solutions/day19.js')).day19main;
      } else {
        console.log('Invalid number.');
        return;
      }

      // Run the corresponding main function
      mainFunction();
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Parse the command line arguments
program.parse(process.argv);
