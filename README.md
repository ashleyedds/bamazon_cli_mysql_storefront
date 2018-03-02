<h1>Bamazon Storefront</h1>

<p>Utilizing MySql and Node.js, this program allows you to interact as either a customer or the manager</p>

<h3>Before you begin</h3>
<p>Make sure to install the <a href="https://www.npmjs.com/package/mysql">MySQL</a>, <a href="https://www.npmjs.com/package/inquirer">Inquirer</a>, and <a href="https://www.npmjs.com/package/cli-table">CLI Table</a> NPM packages.

<h2>Customer Interface</h2>
<p>Here, you can view all of the items avaliable for purchase, select which you'd like to purchase, and how many. Once you've selected your item and item quantity, the program provides you your total cost and updates the database with the new quanity.</p>
<a href="https://drive.google.com/open?id=1dtW83aF8ka8XMGxZMs-aK2CgbcxVRNjt">Click here to see it in action</a>


<h2>Manager Interface</h2>
<p>Here, you have more power over the database. You are presented with the following options: view items for sale, view those with low inventory, add to inventory or add a whole new product.</p>
<p>When you select view items for sale, you do just that. A pretty table with all the inventory and the respective departements, pricing, and avalialbe stock are printed on the console for you.</p>
<p>If you'd like to see which items have low stock (less than five items), select option 2, and each item which meets this critera will be printed on the console for you.</p>
<p>By selecting "Add to inventory" you can increase the stock of any item you have in inventory. This will update the database with the amount you're adding in.</p>
<p>Finally, you can add a whole new product to your inventory. Answer all of the questions as prompted and BOOM. A new product appears in your database.</p>
<a href="https://drive.google.com/open?id=1HSCayLbvp4XMRiO1ql6xG_vrrWxrDS2J">Click here to see it in action</a>
