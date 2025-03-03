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
