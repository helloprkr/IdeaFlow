-- Seed data for testing
insert into auth.users (id, email)
values 
    ('d0d8c19c-3b3e-4f5a-a7b8-c9d0e1f2g3h4', 'test@example.com');

insert into public.profiles (id, username, full_name)
values
    ('d0d8c19c-3b3e-4f5a-a7b8-c9d0e1f2g3h4', 'testuser', 'Test User');

insert into public.ideas (id, title, description, status, user_id)
values
    (
        gen_random_uuid(),
        'Test Idea 1',
        'This is a test idea description',
        'draft',
        'd0d8c19c-3b3e-4f5a-a7b8-c9d0e1f2g3h4'
    );