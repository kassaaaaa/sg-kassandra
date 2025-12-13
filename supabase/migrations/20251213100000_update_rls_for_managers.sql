-- Grant Managers access to profiles
CREATE POLICY "Managers can view all profiles" ON profiles
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'manager'
        )
    );

CREATE POLICY "Managers can update all profiles" ON profiles
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'manager'
        )
    );

-- Grant Managers access to customer_details
CREATE POLICY "Managers can all customer_details" ON customer_details
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'manager'
        )
    );

-- Grant Managers access to instructor_details
CREATE POLICY "Managers can all instructor_details" ON instructor_details
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'manager'
        )
    );
