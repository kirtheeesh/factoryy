const pool = require('./db');

module.exports = (express, bcrypt) => {
    const router = express.Router();

    /**
     * @route   POST /login
     */
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await pool.query(
                'SELECT id, username, password, role FROM users WHERE LOWER(username) = LOWER($1) AND role = $2',
                [email.trim(), 'ACCOUNTS']
            );
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    const { password: _, ...userWithoutPassword } = user;
                    return res.json({ success: true, user: userWithoutPassword });
                }
            }
            return res.status(401).json({ success: false, message: "Invalid Accounts credentials." });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

    /**
     * @route   GET /invoices
     */
    router.get('/invoices', async (req, res) => {
        try {
            const result = await pool.query(
                "SELECT id, customer_name, total_amount, approval_status, invoice_date FROM sales_invoices WHERE approval_status = 'approved' ORDER BY invoice_date DESC"
            );
            res.json(result.rows);
        } catch (err) {
            res.status(500).json([]);
        }
    });

    /**
     * @route   GET /ledger
     */
    router.get('/ledger', async (req, res) => {
        const { fromDate, toDate } = req.query;
        try {
            // Fetch Sales (Credit) - Both manual invoices and history orders
            let salesQuery = `
                SELECT 
                    id::TEXT as "referenceNo", 
                    customer_name as "partyName", 
                    total_amount::NUMERIC as "amount", 
                    invoice_date as "date",
                    'CREDIT' as "type"
                FROM sales_invoices 
                WHERE approval_status = 'approved'
                
                UNION ALL
                
                SELECT 
                    h.invoice_number::TEXT as "referenceNo", 
                    COALESCE(c.name, h.customer_name_manual) as "partyName", 
                    h.total_amount::NUMERIC as "amount", 
                    h.created_at as "date",
                    'CREDIT' as "type"
                FROM sales_history h
                LEFT JOIN sales_customers c ON h.customer_id = c.id
                WHERE h.status = 'Approved' OR h.status = 'Invoiced'
            `;
            const salesParams = [];
            if (fromDate && toDate) {
                salesQuery = `SELECT * FROM (${salesQuery}) AS combined_sales WHERE date::date BETWEEN $1 AND $2`;
                salesParams.push(fromDate, toDate);
            }
            salesQuery += ` ORDER BY date DESC`;
            const salesRes = await pool.query(salesQuery, salesParams);

            // Fetch Purchases (Debit)
            let purchasesQuery = `
                SELECT 
                    id as "referenceNo", 
                    vendor_name as "partyName", 
                    price as "amount", 
                    created_at as "date",
                    'DEBIT' as "type"
                FROM purchase_orders 
                WHERE status = 'APPROVED_BY_ADMIN'
            `;
            const purchasesParams = [];
            if (fromDate && toDate) {
                purchasesQuery += ` AND created_at::date BETWEEN $1 AND $2`;
                purchasesParams.push(fromDate, toDate);
            }
            purchasesQuery += ` ORDER BY created_at DESC`;
            const purchasesRes = await pool.query(purchasesQuery, purchasesParams);

            res.json({
                sales: salesRes.rows,
                purchases: purchasesRes.rows
            });
        } catch (err) {
            console.error("Ledger Fetch Error:", err.message);
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
