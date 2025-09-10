#!/usr/bin/env node

const VMManager = require('../lib/vm-manager');

class VMManagerCLI {
  constructor() {
    this.vmManager = new VMManager();
    this.run();
  }

  async run() {
    const command = process.argv[2];
    
    switch (command) {
      case 'create':
        await this.createVM();
        break;
      case 'list':
        await this.listVMs();
        break;
      case 'cleanup':
        await this.cleanupVMs();
        break;
      case 'reset':
        await this.resetVM();
        break;
      default:
        this.showHelp();
    }
  }

  async createVM() {
    const name = process.argv[3] || `demo-${Date.now()}`;
    console.log(`Creating VM: ${name}`);
    
    try {
      const result = await this.vmManager.createVM(name);
      console.log('✅ VM created successfully:', result);
    } catch (error) {
      console.error('❌ Failed to create VM:', error.message);
    }
  }

  async listVMs() {
    console.log('📋 Listing VMs...');
    
    try {
      const vms = await this.vmManager.listVMs();
      
      if (vms.list && vms.list.length > 0) {
        console.log('\nActive VMs:');
        vms.list.forEach(vm => {
          console.log(`  • ${vm.name} - ${vm.state} - ${vm.ipv4?.[0] || 'No IP'}`);
        });
      } else {
        console.log('No VMs found');
      }
    } catch (error) {
      console.error('❌ Failed to list VMs:', error.message);
    }
  }

  async cleanupVMs() {
    console.log('🧹 Cleaning up VMs...');
    
    try {
      const vms = await this.vmManager.listVMs();
      const haxVMs = vms.list?.filter(vm => vm.name.includes('hax-ai-warp')) || [];
      
      if (haxVMs.length === 0) {
        console.log('No HAX AI Warp VMs to cleanup');
        return;
      }

      console.log(`Found ${haxVMs.length} VMs to cleanup:`);
      haxVMs.forEach(vm => console.log(`  • ${vm.name}`));
      
      for (const vm of haxVMs) {
        console.log(`Deleting ${vm.name}...`);
        await this.vmManager.deleteVM(vm.name);
      }
      
      console.log('✅ Cleanup complete');
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
    }
  }

  async resetVM() {
    const name = process.argv[3];
    
    if (!name) {
      console.error('❌ VM name required for reset');
      return;
    }

    console.log(`Resetting VM: ${name}`);
    
    try {
      await this.vmManager.resetVM(name);
      console.log('✅ VM reset complete');
    } catch (error) {
      console.error('❌ Reset failed:', error.message);
    }
  }

  showHelp() {
    console.log(`
HAX AI Warp VM Manager

Usage:
  npm run vm:create [name]  - Create a new VM
  npm run vm:list          - List all VMs
  npm run vm:cleanup       - Delete all HAX AI Warp VMs
  npm run vm:reset <name>  - Reset a specific VM

Examples:
  npm run vm:create demo
  npm run vm:cleanup
  npm run vm:reset cs101-student123
`);
  }
}

new VMManagerCLI();
