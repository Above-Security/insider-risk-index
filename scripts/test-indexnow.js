#!/usr/bin/env node

/**
 * Script to test IndexNow API and submit core URLs to Bing for immediate indexing
 * Run this after deployment to production to bootstrap the IndexNow integration
 */

const SITE_URL = "https://insider-risk-index-rgiukjb90-aviv-nahums-projects.vercel.app";
const INDEXNOW_KEY = "34842cf7adc727f3a275f5a6020aaadb43bff83cb3951b3a07ca3009a232f79b";

// Core URLs to submit to Bing for immediate indexing
const CORE_URLS = [
  "/",
  "/assessment", 
  "/benchmarks",
  "/matrix",
  "/research", 
  "/playbooks",
  "/glossary",
  "/about",
  "/contact",
  "/research/insider-threat-trends-2025",
  "/research/shadow-ai-insider-threats-2025"
];

async function testKeyFileAccess() {
  console.log("🔑 Testing IndexNow key file accessibility...");
  
  try {
    const keyFileUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
    const response = await fetch(keyFileUrl);
    
    if (response.ok) {
      const content = await response.text();
      if (content.trim() === INDEXNOW_KEY) {
        console.log("✅ Key file is accessible and contains correct key");
        return true;
      } else {
        console.error("❌ Key file contains incorrect content:", content);
        return false;
      }
    } else {
      console.error("❌ Key file not accessible:", response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error("❌ Error accessing key file:", error.message);
    return false;
  }
}

async function testIndexNowAPI() {
  console.log("🔧 Testing IndexNow API endpoint...");
  
  try {
    const response = await fetch(`${SITE_URL}/api/indexnow`);
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ IndexNow API is working:", data);
      return true;
    } else {
      console.error("❌ IndexNow API error:", response.status, data);
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing IndexNow API:", error.message);
    return false;
  }
}

async function submitSingleUrlToBing(url) {
  console.log(`📤 Submitting to Bing: ${url}`);
  
  try {
    const absoluteUrl = `${SITE_URL}${url}`;
    const endpoint = `https://www.bing.com/IndexNow?url=${encodeURIComponent(absoluteUrl)}&key=${INDEXNOW_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'InsiderRiskIndex/1.0 (+https://insiderisk.io/)',
      },
    });
    
    if (response.status === 200 || response.status === 202) {
      console.log(`✅ Successfully submitted: ${absoluteUrl} (Status: ${response.status})`);
      return true;
    } else {
      console.error(`❌ Failed to submit: ${absoluteUrl} (Status: ${response.status} ${response.statusText})`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error submitting ${url}:`, error.message);
    return false;
  }
}

async function bulkSubmitToBing(urls) {
  console.log(`📤 Bulk submitting ${urls.length} URLs to Bing...`);
  
  try {
    const submission = {
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      urlList: urls.map(url => `${SITE_URL}${url}`)
    };
    
    const response = await fetch('https://www.bing.com/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'InsiderRiskIndex/1.0 (+https://insiderisk.io/)',
      },
      body: JSON.stringify(submission)
    });
    
    if (response.status === 200 || response.status === 202) {
      console.log(`✅ Successfully bulk submitted ${urls.length} URLs to Bing (Status: ${response.status})`);
      return true;
    } else {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`❌ Bulk submission failed (Status: ${response.status}):`, errorText);
      return false;
    }
  } catch (error) {
    console.error("❌ Error in bulk submission:", error.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting IndexNow deployment test and initial submission...\n");
  
  // Step 1: Test key file accessibility
  const keyFileOk = await testKeyFileAccess();
  if (!keyFileOk) {
    console.log("⚠️  Key file test failed. IndexNow may not work properly.");
  }
  
  console.log("");
  
  // Step 2: Test our IndexNow API endpoint
  const apiOk = await testIndexNowAPI();
  if (!apiOk) {
    console.log("⚠️  IndexNow API test failed. Proceeding with direct submission.");
  }
  
  console.log("");
  
  // Step 3: Submit core URLs to Bing
  console.log("🎯 Submitting core URLs to Bing for immediate indexing...");
  
  // Try bulk submission first
  const bulkSuccess = await bulkSubmitToBing(CORE_URLS);
  
  if (!bulkSuccess) {
    console.log("⚠️  Bulk submission failed, trying individual submissions...");
    
    let successCount = 0;
    for (const url of CORE_URLS) {
      const success = await submitSingleUrlToBing(url);
      if (success) successCount++;
      
      // Add delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📊 Individual submission results: ${successCount}/${CORE_URLS.length} URLs successfully submitted`);
  }
  
  console.log("\n🏁 IndexNow deployment test and initial submission complete!");
  console.log("🔍 Check Bing Webmaster Tools in 1-2 hours to see if URLs appear in the index.");
  console.log("🤖 This should accelerate ChatGPT visibility per the Reddit case study findings.");
}

// Run the script
main().catch(error => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});